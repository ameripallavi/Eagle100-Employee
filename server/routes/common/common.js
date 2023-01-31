export const sendSuccessResponse = (res, data) => {
  res.status(200);
  res.setHeader("Content-Type", "application/json");
  res.json(data);
  res.end();
};

export const sendFailedResponse = (res, err) => {
  
  res.status(500);
  res.setHeader("Content-Type", "application/json");
  res.json(err);
  res.end();
};

