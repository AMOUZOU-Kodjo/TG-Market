export function pagination(req, _res, next) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const perPage = Math.min(50, Math.max(1, parseInt(req.query.perPage) || 20));
  const skip = (page - 1) * perPage;

  req.pagination = { page, perPage, skip };
  next();
}

export function buildPaginationMeta(total, page, perPage) {
  return {
    currentPage: page,
    lastPage: Math.ceil(total / perPage),
    perPage,
    total,
  };
}
