import os

import requests
import lxml.etree as etree

import today

USER_NAME = os.environ.get('USER_NAME', 'Brainfkt')
TOKEN = os.environ.get('ACCESS_TOKEN')
HEADERS = {'Authorization': f'Bearer {TOKEN}'} if TOKEN else {}


def get_total_stars(username):
    total_stars = 0
    url = f'https://api.github.com/users/{username}/repos'
    params = {'per_page': 100, 'type': 'owner', 'page': 1}

    while True:
        response = requests.get(url, headers=HEADERS, params=params, timeout=30)
        response.raise_for_status()
        repositories = response.json()
        total_stars += sum(repo.get('stargazers_count', 0) for repo in repositories)

        if len(repositories) < params['per_page']:
            break
        params['page'] += 1

    return total_stars


def update_svg(filename, total_stars):
    tree = etree.parse(filename)
    root = tree.getroot()
    today.justify_format(root, 'star_data', total_stars, 16)
    today.justify_line_end(root, 'star_data_dots')
    tree.write(filename, encoding='utf-8', xml_declaration=True)


if __name__ == '__main__':
    total_stars = get_total_stars(USER_NAME)
    update_svg('dark_mode.svg', total_stars)
    update_svg('light_mode.svg', total_stars)
    print(f'GitHub stars (REST): {total_stars}')
