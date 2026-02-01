export const apiBaseURL = 'http://localhost:4000/api/v1';

export const authAPI = {
  signup: async (data) => {
    const res = await fetch(`${apiBaseURL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  login: async (emailAddress, password) => {
    const res = await fetch(`${apiBaseURL}/login`, {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailAddress, password }),
    });
    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${apiBaseURL}/logout`, {
      credentials: 'include',
      method: 'GET',
    });
    return res.json();
  },

  forgot_password: async (emailAddress) => {
    const res = await fetch(`${apiBaseURL}/forgot_password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailAddress }),
    });
    return res.json();
  },

  reset_password: async (token, password, confirmPassword) => {
    const res = await fetch(`${apiBaseURL}/reset_password/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, confirmPassword }),
    });
    return res.json();
  },
};
