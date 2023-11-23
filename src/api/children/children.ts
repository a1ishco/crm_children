import {
  API_CHILDREN_CREATE,
  API_CHILDREN_DELETE,
  API_CHILDREN_GET,
  API_CHILDREN_PAYMENT,
  API_CHILDREN_UPDATE,
} from "../../utils/constants/API/URLS";

export const childrenCreateSubmit = async (token: string, payload: object[]) => {
  try {
    const response = await fetch(API_CHILDREN_CREATE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(payload),
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

export const childrenRetriew = async (
  id: number,
) => {
  try {
    const response = await fetch(`${API_CHILDREN_GET}${id}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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

export const childrenGet = async (
  token: string,
  search: string,
  pagination: { page: string; pageSize: string }
) => {
  try {
    const { page, pageSize } = pagination;
    const params = new URLSearchParams({
      search,
      page: page,
      page_size: pageSize,
    });

    const url = `${API_CHILDREN_GET}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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

export const childrenPrice = async (
  token: string,
  customerID: number,
  childIDs: number[]
) => {
  try {
    const url = `${API_CHILDREN_PAYMENT}${customerID}/price/?children=${childIDs.join('&children=')}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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

export const childrenUpdate = async (payload: object[],id:string) => {
  try {
    const response = await fetch(`${API_CHILDREN_UPDATE}${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      console.error("API Error:", responseData.error);
      return { success: false, error: responseData.error };
    }
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: error };
  }
};

export const childrenDelete = async (token: string, id: number) => {
  try {
    const response = await fetch(`${API_CHILDREN_DELETE}${id}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
