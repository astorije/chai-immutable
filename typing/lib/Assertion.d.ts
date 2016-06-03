declare module '~chai/lib/Assertion' {
  
  // Extend chai's Assertion with the extra ones added by chai-immutable
  export interface Assertion {
    size: Length;
    sizeOf: Length;
  }
}
