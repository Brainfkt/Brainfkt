import os
import unittest
from copy import deepcopy
from unittest.mock import Mock, patch

os.environ.setdefault('ACCESS_TOKEN', 'test-token')

from lxml import etree

import today


def repository(*languages):
    return {
        'node': {
            'languages': {
                'edges': [
                    {'size': size, 'node': {'name': name, 'color': color}}
                    for name, color, size in languages
                ]
            }
        }
    }


class LanguageAggregationTests(unittest.TestCase):
    def test_build_language_segments_groups_languages_after_top_five(self):
        repositories = [
            repository(
                ('Python', '#3572A5', 600),
                ('CSS', '#563d7c', 250),
                ('JavaScript', '#f1e05a', 100),
                ('HTML', '#e34c26', 20),
                ('Shell', '#89e051', 15),
                ('Dockerfile', '#384d54', 10),
                ('Makefile', '#427819', 5),
            ),
            repository(('Python', '#3572A5', 100)),
        ]

        segments = today.build_language_segments(repositories)

        self.assertEqual(
            [segment['name'] for segment in segments],
            ['Python', 'CSS', 'JavaScript', 'HTML', 'Shell', 'Other'],
        )
        self.assertEqual(segments[-1]['bytes'], 15)
        self.assertAlmostEqual(sum(segment['percentage'] for segment in segments), 100)

    def test_build_language_segments_uses_fallback_color_and_handles_empty_data(self):
        segments = today.build_language_segments([repository(('Unknown', None, 10))])

        self.assertEqual(segments[0]['color'], today.LANGUAGE_BAR_FALLBACK_COLOR)
        self.assertEqual(today.build_language_segments([repository()]), [])

    def test_language_block_segments_fill_available_block_count_exactly(self):
        segments = [
            {'name': 'Python', 'color': '#3572A5', 'bytes': 2, 'percentage': 66.666666},
            {'name': 'Other', 'color': '#8b949e', 'bytes': 1, 'percentage': 33.333334},
        ]

        block_segments = today.language_block_segments(segments)

        self.assertEqual(sum(segment['blocks'] for segment in block_segments), today.LANGUAGE_BAR_BLOCKS)
        self.assertEqual([segment['blocks'] for segment in block_segments], [64, 32])

    def test_language_block_segments_keeps_tiny_languages_visible(self):
        segments = [
            {'name': 'Python', 'color': '#3572A5', 'bytes': 999, 'percentage': 99.9},
            {'name': 'Other', 'color': '#8b949e', 'bytes': 1, 'percentage': 0.1},
        ]

        block_segments = today.language_block_segments(segments)

        self.assertEqual(sum(segment['blocks'] for segment in block_segments), today.LANGUAGE_BAR_BLOCKS)
        self.assertEqual(block_segments[-1]['blocks'], 1)

    @patch('today.simple_request')
    def test_languages_getter_follows_repository_pagination(self, simple_request):
        simple_request.side_effect = [
            Mock(json=Mock(return_value={
                'data': {'user': {'repositories': {
                    'edges': [repository(('Python', '#3572A5', 60))],
                    'pageInfo': {'endCursor': 'next-page', 'hasNextPage': True},
                }}},
            })),
            Mock(json=Mock(return_value={
                'data': {'user': {'repositories': {
                    'edges': [repository(('CSS', '#563d7c', 40))],
                    'pageInfo': {'endCursor': None, 'hasNextPage': False},
                }}},
            })),
        ]

        segments = today.languages_getter()

        self.assertEqual([segment['name'] for segment in segments], ['Python', 'CSS'])
        self.assertEqual(simple_request.call_args_list[1].args[2]['cursor'], 'next-page')


class LanguageSvgTests(unittest.TestCase):
    def test_svg_templates_have_extended_canvas_and_language_bar(self):
        namespace = {'svg': 'http://www.w3.org/2000/svg'}
        for filename in ('dark_mode.svg', 'light_mode.svg'):
            root = etree.parse(filename).getroot()

            self.assertEqual(root.get('height'), '590px')
            self.assertIsNotNone(root.find(".//svg:g[@id='language_bar']", namespace))

    def test_render_language_bar_adds_tooltips_and_replaces_previous_segments(self):
        namespace = {'svg': 'http://www.w3.org/2000/svg'}
        root = etree.parse('dark_mode.svg').getroot()
        today.render_language_bar(root, [
            {'name': 'Python', 'color': '#3572A5', 'bytes': 60, 'percentage': 60.0},
            {'name': 'Other', 'color': '#8b949e', 'bytes': 40, 'percentage': 40.0},
        ])
        language_bar = root.find(".//svg:g[@id='language_bar']", namespace)
        block_line = language_bar.find("svg:text[@id='language_bar_blocks']", namespace)
        legend = language_bar.find("svg:text[@id='language_bar_legend']", namespace)
        first_render = block_line.findall("svg:tspan[@data-language-segment='true']", namespace)
        legend_items = legend.findall("svg:tspan[@data-language-legend='true']", namespace)

        self.assertEqual(len(first_render), 2)
        self.assertEqual(first_render[0].find('svg:title', namespace).text, 'Python: 60.0%')
        self.assertEqual(sum(len(segment.text) for segment in first_render), today.LANGUAGE_BAR_BLOCKS)
        self.assertEqual(len(legend_items), 2)
        self.assertEqual(legend_items[0].tail, 'Python 60.0%')

        preserved = deepcopy(language_bar)
        self.assertEqual(
            etree.tostring(language_bar),
            etree.tostring(preserved),
            'Skipping render_language_bar after an API error must leave existing segments untouched.',
        )

        today.render_language_bar(root, [])
        self.assertEqual(block_line.findall("svg:tspan[@data-language-segment='true']", namespace), [])
        self.assertEqual(legend.findall("svg:tspan[@data-language-legend='true']", namespace), [])


class LocFormatTests(unittest.TestCase):
    def test_compact_number_keeps_two_decimal_places(self):
        self.assertEqual(today.compact_number('2,300,000'), '2.30M')
        self.assertEqual(today.compact_number('82,400'), '82.40K')

    def test_compact_loc_values_preserves_raw_total(self):
        self.assertEqual(
            today.compact_loc_values(['2,375,109', '82,439', '2,292,670']),
            ['2.38M', '82.44K', '2,292,670'],
        )


if __name__ == '__main__':
    unittest.main()
