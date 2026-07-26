export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return res.status(422).json({ error: 'Erreur de validation', errors });
    }

    req.validated = result.data;
    next();
  };
}
