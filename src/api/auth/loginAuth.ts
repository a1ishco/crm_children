import { API_LOGIN, API_LOGOUT, API_ME } from '../../utils/constants/API/URLS';
import Cookies from "js-cookie";
export const login = async (email: string, password: string,) => {
  try {
    const response = await fetch(API_LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();
    if (response.ok) {
      Cookies.set("user_token",responseData?.token);
      return { success: true, data: responseData };
    } else {
      return { success: false, error: responseData.error };
    }
  } catch (error) {
    return { success: false, error: error };
  }
};
export const me = async (token:string,) => {
 
  try {
    const response = await fetch(API_ME, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      return { success: false, error: responseData.error };
    }
  } catch (error) {
    return { success: false, error: error };
  }
};
export const logout = async (token:string | undefined,) => {
 
  try {
    const response = await fetch(API_LOGOUT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token || "",
      },
    });

    const responseData = await response.json();
    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      return { success: false, error: responseData.error };
    }
  } catch (error) {
    return { success: false, error: error };
  }
};
