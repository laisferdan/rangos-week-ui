import { HttpErrorResponse } from '@angular/common/http';

const API_DETAILS: Record<string, string> = {
  'Incorrect email or password': 'E-mail ou senha incorretos.',
  'Username already exists': 'Este nome de usuário já está em uso.',
  'Email already exists': 'Este e-mail já está cadastrado.',
  'Recipe not found': 'Alimento não encontrado.',
  'Record not found': 'Registro não encontrado.',
  'Recipe is used by records':
    'Este alimento já foi registrado por algum usuário e não pode ser removido.',
};

/** Converte um erro de HTTP em uma mensagem amigável em português. */
export function friendlyHttpError(
  error: unknown,
  fallback = 'Algo deu errado. Tente novamente.'
): string {
  if (!(error instanceof HttpErrorResponse)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  const detail = (error.error as { detail?: unknown } | null)?.detail;
  if (typeof detail === 'string' && API_DETAILS[detail]) {
    return API_DETAILS[detail];
  }

  if (error.status === 0) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.';
  }
  if (error.status === 401) {
    return 'Sessão expirada. Faça login novamente.';
  }
  if (error.status === 404) {
    return 'Recurso não encontrado.';
  }
  if (error.status === 422) {
    return 'Dados inválidos. Revise os campos e tente novamente.';
  }
  if (error.status >= 500) {
    return 'Erro no servidor. Tente novamente em instantes.';
  }
  return fallback;
}
