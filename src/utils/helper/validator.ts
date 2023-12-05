export const validateEmail = (_rule: object, value: string, callback: (error?: string) => void) => {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      callback();
    } else {
      callback("Enter valid email address");
    }
};
