import aqp from "api-query-params";
function middleware(opts) {
  return function (req, res, next) {
    let { filter, skip, limit, sort, projection, population } = aqp(
      req.query,
      opts
    );
    if (filter.pageNo && filter.pageSize) {
      const page = parseInt(filter.pageNo, 10);
      skip = (page - 1) * filter.pageSize;
      delete filter.pageNo;
      limit = filter.pageSize;
      delete filter.pageSize;
    }
    req.querymen = {
      query: filter,
      select: projection,
      cursor: {
        limit: limit || 10,
        sort: sort || "-createdAt",
        skip: skip || 0,
      },
      population,
    };
    next();
  };
}

export { middleware };
