import api from "@/shared/services/api";

export const walletApi = {
  getBalance: () => api.get("/wallet/balance").then((r) => r.data),
  getTransactions: (params) => api.get("/wallet/transactions", { params }).then((r) => r.data),
  withdraw: (data) => api.post("/wallet/withdraw", data).then((r) => r.data),
  getPaymentMethods: () => api.get("/wallet/payment-methods").then((r) => r.data),
  addPaymentMethod: (data) => api.post("/wallet/payment-methods", data).then((r) => r.data),
  deletePaymentMethod: (id) => api.delete(`/wallet/payment-methods/${id}`).then((r) => r.data),
  setDefaultPaymentMethod: (id) => api.put(`/wallet/payment-methods/${id}/default`).then((r) => r.data),
};

export const escrowApi = {
  create: (data) => api.post("/escrow", data).then((r) => r.data),
  list: (params) => api.get("/escrow", { params }).then((r) => r.data),
  getById: (id) => api.get(`/escrow/${id}`).then((r) => r.data),
  confirmPayment: (id, transactionRef) => api.put(`/escrow/${id}/confirm-payment`, { transactionRef }).then((r) => r.data),
  markAsShipped: (id) => api.put(`/escrow/${id}/mark-shipped`).then((r) => r.data),
  scanConfirm: (token) => api.post("/escrow/scan-confirm", { token }).then((r) => r.data),
  confirmDelivery: (id) => api.put(`/escrow/${id}/confirm-delivery`).then((r) => r.data),
  dispute: (id, data) => api.put(`/escrow/${id}/dispute`, data).then((r) => r.data),
  cancel: (id) => api.put(`/escrow/${id}/cancel`).then((r) => r.data),
  confirmWithCode: (id, code) => api.put(`/escrow/${id}/confirm-code`, { code }).then((r) => r.data),
};
