/*
***
自定义分页
使用例子
const rs = await this.ctx.service.utils.db.paginate();
***
* @param page {Number} 当前页
    * @param pagesize {Number} 每页记录数
    * @param total {Number} 总记录数
    * @constructor
*
*/

module.exports = app => {
  class PageService extends app.Service {

    async paginate(page, pagesize, total) {
      if (!page || page < 1) {
        page = 1;
      }
      if (!pagesize || pagesize < 1) {
        pagesize = 20;
      }
      if (!total || total < 0) {
        total = 0;
      }
      this.pagesize = pagesize;
      this.total = total;
      if (this.total % this.pagesize === 0) {
        this.maxpage = parseInt(this.total / this.pagesize);
      } else {
        this.maxpage = parseInt(this.total / this.pagesize) + 1;
      }
      if (page > this.maxpage) {
        this.page = this.maxpage;
      } else {
        this.page = page;
      }

    }
    /*
    * 当前开始的条数
    */
    async first() {
      const first = (this.page - 1) * this.pagesize;
      if (first > this.total) {
        return (this.maxpage - 1) * this.pagesize;
      }
      return first;
    }

    /*
    * 当前页最大的条数
    */
    async last() {
      const last = this.first() + this.pagesize;
      if (last > this.total) {
        return this.total;
      }
      return last;
    }


    /**
     *  * 上一页
     * @returns {number}
     */

    async prev() {
      if (this.page <= 1) {
        return false;
      }
      return this.page - 1;
    }


    /**
     *  下一页
     *  @returns {*}
    */

    async next() {
      if (this.page >= this.maxpage) {
        return false;
      }
      return (parseInt(this.page) + 1);
    }


  }
  return PageService;
};
