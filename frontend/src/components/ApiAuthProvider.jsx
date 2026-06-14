// Cookie-based auth — no token getter needed.
// The httpOnly JWT cookie is sent automatically with every request
// because axios is configured with withCredentials: true.
function ApiAuthProvider({ children }) {
  return children;
}

export default ApiAuthProvider;
