'use strict';

/**
 * Map of all block types. Blocks can contain inlines or blocks.
 * @type {Map}
 */

module.exports = {
    TEXT: 'unstyled',
    // Classic blocks
    CODE: 'code_block',
    CODE_LINE: 'code_line',
    DIVBLOCK: 'div_block',
    BLOCKQUOTE: 'blockquote',
    PARAGRAPH: 'paragraph',
    FOOTNOTE: 'footnote',
    HTML: 'html_block',
    HR: 'hr',
    // Headings
    HEADING_1: 'header_one',
    HEADING_2: 'header_two',
    HEADING_3: 'header_three',
    HEADING_4: 'header_four',
    HEADING_5: 'header_five',
    HEADING_6: 'header_six',
    // Table
    TABLE: 'table',
    TABLE_ROW: 'table_row',
    TABLE_CELL: 'table_cell',
    // Lists
    OL_LIST: 'ordered_list',
    UL_LIST: 'unordered_list',
    LIST_ITEM: 'list_item',
    TAB_LIST: 'tabs',
    TAB_ITEM: 'tabs-item',
    // Comment
    COMMENT: 'comment',
    // Default block
    DEFAULT: 'paragraph',
    VIDEO: 'video',
    ADV_TABLE: 'adv_table',
    CUSTOM_HTML: 'custom_html'
};