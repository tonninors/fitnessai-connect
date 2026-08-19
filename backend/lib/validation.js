/**
 * Validadores de entrada. Devuelven el valor normalizado o lanzan `HttpError`.
 */
import { badRequest } from './http.js';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value) {
  return typeof value === 'string' && UUID_RE.test(value);
}

export function requireUuid(value, field) {
  if (!isUuid(value)) throw badRequest(`${field} inválido`);
  return value;
}

/** Entero dentro de un rango. `undefined`/`null`/'' → `fallback`. */
export function optionalInt(value, field, { min, max, fallback = null } = {}) {
  if (value === undefined || value === null || value === '') return fallback;
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isInteger(num)) throw badRequest(`${field} debe ser un número entero`);
  if (min !== undefined && num < min) throw badRequest(`${field} debe ser >= ${min}`);
  if (max !== undefined && num > max) throw badRequest(`${field} debe ser <= ${max}`);
  return num;
}

/** Número decimal opcional dentro de un rango. */
export function optionalNumber(value, field, { min, max, fallback = null } = {}) {
  if (value === undefined || value === null || value === '') return fallback;
  const num = Number(value);
  if (!Number.isFinite(num)) throw badRequest(`${field} debe ser un número`);
  if (min !== undefined && num < min) throw badRequest(`${field} debe ser >= ${min}`);
  if (max !== undefined && num > max) throw badRequest(`${field} debe ser <= ${max}`);
  return num;
}

/** Valor que debe pertenecer a un conjunto cerrado. */
export function optionalEnum(value, field, allowed, { fallback = null } = {}) {
  if (value === undefined || value === null || value === '') return fallback;
  if (!allowed.includes(value)) throw badRequest(`${field} debe ser uno de: ${allowed.join(', ')}`);
  return value;
}

export function requireEnum(value, field, allowed) {
  if (!allowed.includes(value)) throw badRequest(`${field} debe ser uno de: ${allowed.join(', ')}`);
  return value;
}

/** Texto con longitud máxima; recorta espacios. */
export function optionalText(value, field, { maxLength = 2000, fallback = null } = {}) {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'string') throw badRequest(`${field} debe ser texto`);
  const trimmed = value.trim();
  if (trimmed.length > maxLength) throw badRequest(`${field} supera los ${maxLength} caracteres`);
  return trimmed === '' ? fallback : trimmed;
}

export function requireEmail(value) {
  if (typeof value !== 'string' || value.trim() === '') throw badRequest('Email requerido');
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw badRequest('Email inválido');
  return email;
}

/** Filtra un objeto dejando sólo las claves permitidas (whitelist). */
export function pickAllowed(source, allowed) {
  if (!source || typeof source !== 'object') return {};
  return Object.fromEntries(
    Object.entries(source).filter(([key, value]) => allowed.includes(key) && value !== undefined)
  );
}
