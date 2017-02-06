let pagination = require('pagination');

/**
 * function helpers. template pagination
 * @param params
 * @returns {pagination.TemplatePaginator}
 */
module.exports = function(params) {
	return new pagination.TemplatePaginator({
		prelink:params.prelink,
		current: params.current,
		rowsPerPage: params.rowsPerPage,
		totalResult: params.totalResult,
		slashSeparator: true,
		template: function(result) {
			let i, len, prelink;
			let html = '<div><ul class="pagination">';

			if(result.pageCount < 2) {
				html += '</ul></div>';
				return html;
			}

			prelink = this.preparePreLink(result.prelink);
			if(result.previous) html += '<li><a href="' + prelink + result.previous + '">Назад</a></li>';

			if(result.range.length) {
				for( i = 0, len = result.range.length; i < len; i++) {
					if(result.range[i] === result.current) {
						html += '<li class="active"><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
					} else {
						html += '<li><a href="' + prelink + result.range[i] + '">' + result.range[i] + '</a></li>';
					}
				}
			}

			if(result.next)
				html += '<li><a href="' + prelink + result.next + '" class="paginator-next">Вперёд</a></li>';

			html += '</ul></div>';

			return html;
		}
	})
};
