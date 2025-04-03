import '@testing-library/jest-dom';

// Mock for createObjectURL used in file uploads
global.URL.createObjectURL = vi.fn(() => 'blob:fake-url');
