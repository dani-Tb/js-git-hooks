/* global expect, it, describe */

'use strict';

const filterByfileTypes = require('../../../app/lib/hooks/filter.by.file.types');

describe('FILTER BY FILE TYPES', function () {
    it('should return empty list when empty list as argument', function () {
        const filtered = filterByfileTypes([], /.js$/);

        expect(filtered).to.deep.equal([]);
    });

    it('should return empty list if no path matches reg exp', function () {
        const filesList = [
            'some/folder/file.php',
            'other/folder/style.scss'
        ];

        const filtered = filterByfileTypes(filesList, /.js$/);

        expect(filtered).to.deep.equal([]);
    });

    it('should return only matching files', function () {
        const filesList = [
            'some/folder/file.js',
            'other/folder/style.scss',
            'some/folder/other.js',
            'other/folder/other.style.scss'
        ];

        const expected = [
            'some/folder/file.js',
            'some/folder/other.js'
        ];

        const filtered = filterByfileTypes(filesList, /.js$/);

        expect(filtered).to.deep.equal(expected);
    });
});