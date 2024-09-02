"use client";

export const getLocalStorage = (key: string) => {
  try {
    const res = localStorage.getItem(key);
    return res;
  } catch (err) {
    return undefined;
  }
};


export const setLocalStorage = (key: string, value: string) => {
    try {
      const res = localStorage.setItem(key, value);
    } catch (err) {
      return undefined;
    }
  };