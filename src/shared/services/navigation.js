const AUTH_LOGOUT_EVENT = "auth:logout";

export function dispatchLogout() {
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
}

export function onLogout(handler) {
  const wrapped = () => handler();
  window.addEventListener(AUTH_LOGOUT_EVENT, wrapped);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, wrapped);
}
