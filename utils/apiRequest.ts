export const postRequest = async (endpoint: string, bodyJson: Object) => {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyJson),
  });
  return res;
};
