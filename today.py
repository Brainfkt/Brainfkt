import datetime
import hashlib
import os
import time

import requests
from dateutil import relativedelta
from lxml import etree

HEADERS = {'authorization': 'token ' + os.environ['ACCESS_TOKEN']}
USER_NAME = os.environ.get('USER_NAME', 'Brainfkt')
QUERY_COUNT = {'user_getter': 0, 'follower_getter': 0, 'graph_repos_stars': 0, 'recursive_loc': 0, 'loc_query': 0, 'languages_getter': 0}

LANGUAGE_BAR_X = 15
LANGUAGE_BAR_WIDTH = 955
LANGUAGE_BAR_FALLBACK_COLOR = '#8b949e'


def daily_readme(birthday):
    diff = relativedelta.relativedelta(datetime.datetime.today(), birthday)
    return '{} {}, {} mois, {} jour{}{}'.format(
        diff.years, 'an' if diff.years == 1 else 'ans',
        diff.months,
        diff.days, '' if diff.days == 1 else 's',
        ' 🎂' if (diff.months == 0 and diff.days == 0) else '')


def simple_request(func_name, query, variables):
    request = requests.post('https://api.github.com/graphql', json={'query': query, 'variables':variables}, headers=HEADERS)
    if request.status_code == 200:
        return request
    raise Exception(func_name, ' has failed with a', request.status_code, request.text, QUERY_COUNT)


def graph_repos_stars(count_type, owner_affiliation, cursor=None):
    query_count('graph_repos_stars')
    query = '''
    query ($owner_affiliation: [RepositoryAffiliation], $login: String!, $cursor: String) {
        user(login: $login) {
            repositories(first: 100, after: $cursor, ownerAffiliations: $owner_affiliation) {
                totalCount
                edges {
                    node {
                        ... on Repository {
                            nameWithOwner
                            stargazers {
                                totalCount
                            }
                        }
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }'''
    variables = {'owner_affiliation': owner_affiliation, 'login': USER_NAME, 'cursor': cursor}
    request = simple_request(graph_repos_stars.__name__, query, variables)
    if request.status_code == 200:
        if count_type == 'repos':
            return request.json()['data']['user']['repositories']['totalCount']
        elif count_type == 'stars':
            return stars_counter(request.json()['data']['user']['repositories']['edges'])


def languages_getter(cursor=None, edges=None):
    if edges is None:
        edges = []
    query_count('languages_getter')
    query = '''
    query ($login: String!, $cursor: String) {
        user(login: $login) {
            repositories(first: 100, after: $cursor, ownerAffiliations: [OWNER]) {
                edges {
                    node {
                        languages(first: 100, orderBy: {field: SIZE, direction: DESC}) {
                            edges {
                                size
                                node {
                                    color
                                    name
                                }
                            }
                        }
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }'''
    variables = {'login': USER_NAME, 'cursor': cursor}
    request = simple_request(languages_getter.__name__, query, variables)
    repositories = request.json()['data']['user']['repositories']
    edges += repositories['edges']
    if repositories['pageInfo']['hasNextPage']:
        return languages_getter(repositories['pageInfo']['endCursor'], edges)
    return build_language_segments(edges)


def build_language_segments(repositories, limit=5):
    languages = {}
    for repository in repositories:
        for edge in repository['node']['languages']['edges']:
            name = edge['node']['name']
            language = languages.setdefault(name, {'name': name, 'color': edge['node']['color'] or LANGUAGE_BAR_FALLBACK_COLOR, 'bytes': 0})
            language['bytes'] += edge['size']

    ranked = sorted(languages.values(), key=lambda language: (-language['bytes'], language['name']))
    if len(ranked) > limit:
        other_bytes = sum(language['bytes'] for language in ranked[limit:])
        ranked = ranked[:limit] + [{'name': 'Other', 'color': LANGUAGE_BAR_FALLBACK_COLOR, 'bytes': other_bytes}]

    total_bytes = sum(language['bytes'] for language in ranked)
    if total_bytes == 0:
        return []
    for language in ranked:
        language['percentage'] = language['bytes'] * 100 / total_bytes
    return ranked


def language_bar_rectangles(languages, x=LANGUAGE_BAR_X, width=LANGUAGE_BAR_WIDTH):
    rectangles = []
    offset = x
    for index, language in enumerate(languages):
        segment_width = x + width - offset if index == len(languages) - 1 else width * language['percentage'] / 100
        rectangles.append({**language, 'x': offset, 'width': segment_width})
        offset += segment_width
    return rectangles


def recursive_loc(owner, repo_name, data, addition_total=0, deletion_total=0, my_commits=0, cursor=None):
    query_count('recursive_loc')
    query = '''
    query ($repo_name: String!, $owner: String!, $cursor: String) {
        repository(name: $repo_name, owner: $owner) {
            defaultBranchRef {
                target {
                    ... on Commit {
                        history(first: 100, after: $cursor) {
                            totalCount
                            edges {
                                node {
                                    ... on Commit {
                                        committedDate
                                    }
                                    author {
                                        user {
                                            id
                                        }
                                    }
                                    deletions
                                    additions
                                }
                            }
                            pageInfo {
                                endCursor
                                hasNextPage
                            }
                        }
                    }
                }
            }
        }
    }'''
    variables = {'repo_name': repo_name, 'owner': owner, 'cursor': cursor}
    # Preserve partial cache progress when a repository request fails.
    request = requests.post('https://api.github.com/graphql', json={'query': query, 'variables':variables}, headers=HEADERS)
    if request.status_code == 200:
        if request.json()['data']['repository']['defaultBranchRef'] is not None:
            return loc_counter_one_repo(owner, repo_name, data, request.json()['data']['repository']['defaultBranchRef']['target']['history'], addition_total, deletion_total, my_commits)
        else: return 0
    force_close_file(data)
    if request.status_code == 403:
        raise Exception('Too many requests in a short amount of time!\nYou\'ve hit the non-documented anti-abuse limit!')
    raise Exception('recursive_loc() has failed with a', request.status_code, request.text, QUERY_COUNT)


def loc_counter_one_repo(owner, repo_name, data, history, addition_total, deletion_total, my_commits):
    for node in history['edges']:
        if node['node']['author']['user'] == OWNER_ID:
            my_commits += 1
            addition_total += node['node']['additions']
            deletion_total += node['node']['deletions']

    if history['edges'] == [] or not history['pageInfo']['hasNextPage']:
        return addition_total, deletion_total, my_commits
    else: return recursive_loc(owner, repo_name, data, addition_total, deletion_total, my_commits, history['pageInfo']['endCursor'])


def loc_query(owner_affiliation, force_cache=False, cursor=None, edges=None):
    if edges is None:
        edges = []
    query_count('loc_query')
    query = '''
    query ($owner_affiliation: [RepositoryAffiliation], $login: String!, $cursor: String) {
        user(login: $login) {
            repositories(first: 60, after: $cursor, ownerAffiliations: $owner_affiliation) {
            edges {
                node {
                    ... on Repository {
                        nameWithOwner
                        defaultBranchRef {
                            target {
                                ... on Commit {
                                    history {
                                        totalCount
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                pageInfo {
                    endCursor
                    hasNextPage
                }
            }
        }
    }'''
    variables = {'owner_affiliation': owner_affiliation, 'login': USER_NAME, 'cursor': cursor}
    request = simple_request(loc_query.__name__, query, variables)
    if request.json()['data']['user']['repositories']['pageInfo']['hasNextPage']:
        edges += request.json()['data']['user']['repositories']['edges']
        return loc_query(owner_affiliation, force_cache, request.json()['data']['user']['repositories']['pageInfo']['endCursor'], edges)
    else:
        return cache_builder(edges + request.json()['data']['user']['repositories']['edges'], force_cache)


def cache_builder(edges, force_cache, loc_add=0, loc_del=0):
    cached = True
    filename = 'cache/' + hashlib.sha256(USER_NAME.encode('utf-8')).hexdigest() + '.txt'
    try:
        with open(filename, 'r') as f:
            data = f.readlines()
    except FileNotFoundError:
        data = []
        with open(filename, 'w') as f:
            f.writelines(data)

    if len(data) != len(edges) or force_cache:
        cached = False
        flush_cache(edges, filename)
        with open(filename, 'r') as f:
            data = f.readlines()

    for index in range(len(edges)):
        repo_hash, commit_count, *__ = data[index].split()
        if repo_hash == hashlib.sha256(edges[index]['node']['nameWithOwner'].encode('utf-8')).hexdigest():
            try:
                if int(commit_count) != edges[index]['node']['defaultBranchRef']['target']['history']['totalCount']:
                    owner, repo_name = edges[index]['node']['nameWithOwner'].split('/')
                    loc = recursive_loc(owner, repo_name, data)
                    data[index] = repo_hash + ' ' + str(edges[index]['node']['defaultBranchRef']['target']['history']['totalCount']) + ' ' + str(loc[2]) + ' ' + str(loc[0]) + ' ' + str(loc[1]) + '\n'
            except TypeError:
                data[index] = repo_hash + ' 0 0 0 0\n'
    with open(filename, 'w') as f:
        f.writelines(data)
    for line in data:
        loc = line.split()
        loc_add += int(loc[3])
        loc_del += int(loc[4])
    return [loc_add, loc_del, loc_add - loc_del, cached]


def flush_cache(edges, filename):
    with open(filename, 'w') as f:
        for node in edges:
            f.write(hashlib.sha256(node['node']['nameWithOwner'].encode('utf-8')).hexdigest() + ' 0 0 0 0\n')


def force_close_file(data):
    filename = 'cache/' + hashlib.sha256(USER_NAME.encode('utf-8')).hexdigest() + '.txt'
    with open(filename, 'w') as f:
        f.writelines(data)
    print('There was an error while writing to the cache file. The file,', filename, 'has had the partial data saved and closed.')


def stars_counter(data):
    total_stars = 0
    for node in data: total_stars += node['node']['stargazers']['totalCount']
    return total_stars


def svg_overwrite(filename, age_data, commit_data, star_data, repo_data, contrib_data, follower_data, loc_data, languages=None):
    loc_data = compact_loc_values(loc_data)
    tree = etree.parse(filename)
    root = tree.getroot()
    justify_format(root, 'age_data', age_data, 52)
    justify_format(root, 'commit_data', commit_data, 22)
    justify_format(root, 'star_data', star_data, 16)
    justify_format(root, 'repo_data', repo_data, 6)
    justify_format(root, 'contrib_data', contrib_data)
    justify_format(root, 'follower_data', follower_data, 11)
    justify_format(root, 'loc_data', loc_data[2], 22)
    justify_format(root, 'loc_add', loc_data[0])
    justify_format(root, 'loc_del', loc_data[1], 9)
    justify_separator_column(root, 'repo_data_dots', '|')
    justify_separator_column(root, 'commit_data_dots', '|')
    justify_separator_column(root, 'loc_data_dots', '(')
    justify_line_end(root, 'star_data_dots')
    justify_line_end(root, 'follower_data_dots')
    justify_line_end(root, 'loc_del_dots')
    if languages is not None:
        render_language_bar(root, languages)
    tree.write(filename, encoding='utf-8', xml_declaration=True)


def render_language_bar(root, languages):
    namespace = {'svg': root.nsmap.get(None)} if root.nsmap.get(None) else {}
    prefix = 'svg:' if namespace else ''
    language_bar = root.find(f".//{prefix}g[@id='language_bar']", namespace)
    if language_bar is None:
        return
    for rectangle in language_bar.findall(f"{prefix}rect[@data-language-segment='true']", namespace):
        language_bar.remove(rectangle)
    svg_namespace = f"{{{root.nsmap[None]}}}" if root.nsmap.get(None) else ''
    for rectangle in language_bar_rectangles(languages):
        element = etree.SubElement(language_bar, f'{svg_namespace}rect', {
            'data-language-segment': 'true',
            'x': format_svg_number(rectangle['x']),
            'y': '540',
            'width': format_svg_number(rectangle['width']),
            'height': '8',
            'fill': rectangle['color'],
        })
        title = etree.SubElement(element, f'{svg_namespace}title')
        title.text = f"{rectangle['name']}: {rectangle['percentage']:.1f}%"


def format_svg_number(number):
    return f'{number:.6f}'.rstrip('0').rstrip('.')


def compact_loc_values(loc_data, suffix_width=24):
    loc_data = [str(value) for value in loc_data]
    if len(f"( {loc_data[0]}++, {loc_data[1]}-- )") <= suffix_width:
        return loc_data
    return [compact_number(value) for value in loc_data]


def compact_number(value):
    number = int(str(value).replace(',', ''))
    for divisor, suffix in ((1_000_000_000, 'B'), (1_000_000, 'M'), (1_000, 'K')):
        if abs(number) >= divisor:
            return f'{number / divisor:.1f}'.rstrip('0').rstrip('.') + suffix
    return str(number)


def justify_format(root, element_id, new_text, length=0):
    if isinstance(new_text, int):
        new_text = f"{'{:,}'.format(new_text)}"
    new_text = str(new_text)
    find_and_replace(root, element_id, new_text)
    just_len = max(0, length - len(new_text))
    if just_len <= 2:
        dot_map = {0: '', 1: ' ', 2: '. '}
        dot_string = dot_map[just_len]
    else:
        dot_string = ' ' + ('.' * just_len) + ' '
    find_and_replace(root, f"{element_id}_dots", dot_string)


def justify_separator_column(root, dots_id, delimiter, target_column=36):
    dots = root.find(f".//*[@id='{dots_id}']")
    if dots is None:
        return
    line = line_text(dots)
    difference = target_column - line.index(delimiter)
    width = len(dots.text or '') + difference
    if width < 1:
        raise ValueError(f'Not enough room to align {delimiter!r} in {dots_id}')
    set_dot_width(dots, width)


def justify_line_end(root, dots_id, target_length=60):
    primary_dots = root.find(f".//*[@id='{dots_id}']")
    if primary_dots is None:
        return
    line = line_text(primary_dots)
    difference = target_length - len(line)
    if difference > 0:
        set_dot_width(primary_dots, len(primary_dots.text or '') + difference)
        return
    removable_width = max(0, len(primary_dots.text or '') - 1)
    if -difference > removable_width:
        raise ValueError(f'Not enough room to align the right margin in {dots_id}')
    set_dot_width(primary_dots, len(primary_dots.text or '') + difference)


def line_text(element):
    siblings = list(element.getparent())
    start = siblings.index(element)
    while start > 0 and 'y' not in siblings[start].attrib:
        start -= 1
    end = start + 1
    while end < len(siblings) and 'y' not in siblings[end].attrib:
        end += 1
    return ''.join((node.text or '') + (node.tail or '') for node in siblings[start:end]).rstrip()


def set_dot_width(element, width):
    if width <= 0:
        element.text = ''
    elif width == 1:
        element.text = ' '
    elif width == 2:
        element.text = '. '
    else:
        element.text = ' ' + ('.' * (width - 2)) + ' '


def find_and_replace(root, element_id, new_text):
    element = root.find(f".//*[@id='{element_id}']")
    if element is not None:
        element.text = new_text


def commit_counter():
    total_commits = 0
    filename = 'cache/' + hashlib.sha256(USER_NAME.encode('utf-8')).hexdigest() + '.txt'
    with open(filename, 'r') as f:
        data = f.readlines()
    for line in data:
        total_commits += int(line.split()[2])
    return total_commits


def user_getter(username):
    query_count('user_getter')
    query = '''
    query($login: String!){
        user(login: $login) {
            id
        }
    }'''
    variables = {'login': username}
    request = simple_request(user_getter.__name__, query, variables)
    return {'id': request.json()['data']['user']['id']}

def follower_getter(username):
    query_count('follower_getter')
    query = '''
    query($login: String!){
        user(login: $login) {
            followers {
                totalCount
            }
        }
    }'''
    request = simple_request(follower_getter.__name__, query, {'login': username})
    return int(request.json()['data']['user']['followers']['totalCount'])


def query_count(funct_id):
    global QUERY_COUNT
    QUERY_COUNT[funct_id] += 1


def perf_counter(funct, *args):
    start = time.perf_counter()
    funct_return = funct(*args)
    return funct_return, time.perf_counter() - start


def formatter(query_type, difference):
    print('{:<23}'.format('   ' + query_type + ':'), sep='', end='')
    print('{:>12}'.format('%.4f' % difference + ' s ')) if difference > 1 else print('{:>12}'.format('%.4f' % (difference * 1000) + ' ms'))


if __name__ == '__main__':
    print('Calculation times:')
    user_data, user_time = perf_counter(user_getter, USER_NAME)
    OWNER_ID = user_data
    formatter('account data', user_time)
    age_data, age_time = perf_counter(daily_readme, datetime.datetime(2002, 12, 1))
    formatter('age calculation', age_time)
    total_loc, loc_time = perf_counter(loc_query, ['OWNER', 'COLLABORATOR', 'ORGANIZATION_MEMBER'])
    formatter('LOC (cached)', loc_time) if total_loc[-1] else formatter('LOC (no cache)', loc_time)
    commit_data, commit_time = perf_counter(commit_counter)
    star_data, star_time = perf_counter(graph_repos_stars, 'stars', ['OWNER'])
    repo_data, repo_time = perf_counter(graph_repos_stars, 'repos', ['OWNER'])
    contrib_data, contrib_time = perf_counter(graph_repos_stars, 'repos', ['OWNER', 'COLLABORATOR', 'ORGANIZATION_MEMBER'])
    follower_data, follower_time = perf_counter(follower_getter, USER_NAME)
    languages = None
    language_time = 0
    try:
        languages, language_time = perf_counter(languages_getter)
        formatter('languages', language_time)
    except Exception as error:
        print('   languages: preserving previous SVG bar after API error:', error)

    for index in range(len(total_loc)-1): total_loc[index] = '{:,}'.format(total_loc[index])

    svg_overwrite('dark_mode.svg', age_data, commit_data, star_data, repo_data, contrib_data, follower_data, total_loc[:-1], languages)
    svg_overwrite('light_mode.svg', age_data, commit_data, star_data, repo_data, contrib_data, follower_data, total_loc[:-1], languages)

    # Rewrite the timing header in place.
    print('\033[F\033[F\033[F\033[F\033[F\033[F\033[F\033[F',
        '{:<21}'.format('Total function time:'), '{:>11}'.format('%.4f' % (user_time + age_time + loc_time + commit_time + star_time + repo_time + contrib_time + language_time)),
        ' s \033[E\033[E\033[E\033[E\033[E\033[E\033[E\033[E', sep='')

    print('Total GitHub GraphQL API calls:', '{:>3}'.format(sum(QUERY_COUNT.values())))
    for funct_name, count in QUERY_COUNT.items(): print('{:<28}'.format('   ' + funct_name + ':'), '{:>6}'.format(count))
