import '@testing-library/jest-dom';

// Polyfill for TextEncoder/TextDecoder (required for jsdom)
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

