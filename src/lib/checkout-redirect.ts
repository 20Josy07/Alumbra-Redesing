/**
 * Redirige al checkout de la pasarela.
 * - PayU WebCheckout requiere un POST de formulario → construimos y enviamos un <form>.
 * - Si en el futuro la pasarela devuelve una URL directa, también se soporta.
 */
export interface CheckoutResponse {
  url?: string;
  action?: string;
  fields?: Record<string, string>;
}

export function redirectToCheckout(data: CheckoutResponse): boolean {
  if (typeof document === 'undefined') return false;

  if (data.action && data.fields) {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = data.action;
    form.style.display = 'none';
    Object.entries(data.fields).forEach(([name, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = name;
      input.value = value ?? '';
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    return true;
  }

  if (data.url) {
    window.location.href = data.url;
    return true;
  }

  return false;
}
