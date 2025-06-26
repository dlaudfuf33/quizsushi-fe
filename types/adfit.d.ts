export {};

declare global {
  interface Window {
    kakao?: {
      adfit?: {
        load?: () => void;
      };
    };
  }
}
