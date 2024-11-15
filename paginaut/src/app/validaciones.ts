import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function soloLetras(requerido: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if ((requerido && !valor) || (requerido && valor.length === 0)) {
      return { required: true };
    }

    // Limpiar y formatear el texto según las reglas necesarias
    let textoFormateado = valor
      .replace(/ {2,}/g, ' ') // Reemplazar múltiples espacios en blanco por uno solo
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]+/g, ''); // Permitir solo letras (con o sin acentos) y espacios en blanco

    // Actualizar el valor del control con el texto formateado
    if (textoFormateado !== valor) {
      control.setValue(textoFormateado.trim()); // Actualizar el valor del control con el texto formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }
    return null; // No hay errores, el texto es válido y está formateado correctamente
  };
}

export function soloLetrasConPuntuacion(requerido: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
  
      // Verificar si el campo es requerido y está vacío
      if ((requerido && !valor) || (requerido && valor.length === 0)) {
        return { required: true };
      }
  
      // Validar y formatear el texto: permitir letras (con acentos), números, punto, coma, asterisco y guion bajo
      const caracteresProhibidos = /[\[\]{}\-+´¿'|]/; // Expresión regular para caracteres prohibidos
      let textoFormateado = '';
  
      // Recorrer cada carácter y validar
      for (const char of valor) {
        // Permite letras, números, espacios, punto, coma, asterisco y guion bajo, pero excluye caracteres prohibidos
        if (/[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\*\_,.]/.test(char) && !caracteresProhibidos.test(char)) {
          textoFormateado += char;
        }
      }
  
      // Actualizar el valor del control si es necesario
      if (textoFormateado !== valor) {
        control.setValue(textoFormateado.trim());
        control.markAsDirty();
      }
  
      return null; // No hay errores
    };
  }  

export function ValidarNumeros(requerido: boolean): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if ((requerido && !valor) || (requerido && valor.length === 0)) {
      return { required: true };
    }

    // Limpiar y formatear el número de teléfono según las reglas necesarias
    let telefonoValidado = valor.replace(/\D/g, ''); // Eliminar todos los caracteres que no sean dígitos

    if (telefonoValidado !== valor) {
      control.setValue(telefonoValidado);
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

    return null;
  };
}

export function ValidarNumerosLetras(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;
    if (!valor) {
      return { required: true };
    }
    // Limpiar el texto
    let textoLimpiado = valor
      .replace(/ {2,}/g, ' ') // Reemplazar varios espacios en blanco seguidos por uno solo
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+/g, '') // Eliminar caracteres no permitidos
      .replace(
        /^[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+|[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-]+$/g,
        ''
      ); // Eliminar caracteres no permitidos al principio o final

    if (textoLimpiado !== valor) {
      control.setValue(textoLimpiado.trim()); // Actualizar el valor del control con el texto limpiado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }
    return null; // No hay errores, el texto es válido y está limpiado correctamente
  };
}

export function validarTelefono(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let valor = control.value;
  
      if (!valor) {
        return { required: true };
      }
  
      // Remover caracteres no numéricos, excepto un único signo '+' al inicio
      valor = valor.replace(/[^+\d]/g, ''); // Permite solo '+' y dígitos
  
      // Agregar un solo '+' al inicio si no lo tiene
      if (!valor.startsWith('+')) {
        valor = '+' + valor;
      }
  
      // Validar que solo haya un '+' al inicio y que tenga entre 12 y 15 dígitos en total
      const regexTelefono = /^\+\d{12,15}$/;
      if (!regexTelefono.test(valor)) {
        return { invalidPhone: true };
      }
  
      // Si el número formateado no coincide con el valor original, actualizar el valor del control
      if (valor !== control.value) {
        control.setValue(valor); // Actualizar el valor del control con el teléfono formateado
        control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
      }
  
      return null; // No hay errores, el teléfono es válido y está formateado correctamente
    };
  }

export function ValidarCorreoPersonal(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let valor = control.value;

    if (!valor) {
      return { required: true };
    }

    // Definir dominios permitidos
    const dominiosPermitidos = [
      'gmail.com',
      'outlook.com',
      'hotmail.com',
      'icloud.com',
      'yahoo.com',
    ];

    // Separar la parte del nombre de usuario y el dominio
    let partes = valor.split('@');
    if (partes.length !== 2) {
      return { correoInvalido: true }; // Error si no hay exactamente una @
    }

    // Limpiar el nombre de usuario y el dominio
    partes[0] = partes[0].replace(/[^a-zA-Z0-9._-]/g, ''); // Permitir solo letras, números y algunos caracteres en el nombre de usuario
    partes[1] = partes[1].replace(/[^a-zA-Z0-9.-]/g, ''); // Permitir solo letras, números, puntos y guiones en el dominio

    // Validar si el dominio ingresado está en la lista de dominios permitidos
    if (!dominiosPermitidos.includes(partes[1])) {
      return { dominioNoPermitido: true };
    }

    // Asegurar que el correo tenga el formato "nombre@dominioPermitido"
    const emailFormateado = `${partes[0]}@${partes[1]}`;

    // Evitar que se pueda escribir algo después de nombre@dominioPermitido
    if (emailFormateado !== valor) {
      control.setValue(emailFormateado); // Actualizar el valor del control con el correo formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

    // Validar el formato general del correo electrónico
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(emailFormateado)) {
      return { correoInvalido: true };
    }

    return null; // No hay errores, el correo es válido y está formateado correctamente
  };
}

export function validarCorreoUTDelacosta(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor = control.value;

    if (!valor) {
      return { required: true };
    }

    // Formatear el correo electrónico según las reglas necesarias
    let partes = valor.split('@');
    if (partes.length > 1) {
      partes[1] = partes[1].replace(/[^a-zA-Z0-9.-]+/g, ''); // Eliminar caracteres no permitidos
      if (partes[1] !== 'utdelacosta.edu.mx') {
        partes[1] = 'utdelacosta.edu.mx';
      }
    }

    const emailFormateado = partes
      .join('@')
      .replace(/[^a-zA-Z0-9@._-]+/g, '') // Permitir solo letras, números y los caracteres @, ._, y -
      .replace(/\.{2,}/g, '.') // Reemplazar puntos consecutivos con un solo punto
      .replace(/\.@|@\./g, '@'); // Evitar punto inmediatamente antes o después de @

    if (emailFormateado !== valor) {
      control.setValue(emailFormateado.trim()); // Actualizar el valor del control con el correo formateado
      control.markAsDirty(); // Marcar el control como modificado para que Angular actualice la vista
    }

    // Validar el formato del correo electrónico
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(emailFormateado)) {
      return { correoInvalido: true };
    }

    return null; // No hay errores, el correo es válido y está formateado correctamente
  };
}

export class TooltipManager {
  static adjustTooltipPosition(
    button: HTMLElement,
    tooltip: HTMLElement
  ): void {
    // Obtener dimensiones del botón y del tooltip
    const buttonRect = button.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    // Obtener dimensiones de la ventana
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Calcular la posición preferida del tooltip
    const preferredLeft =
      buttonRect.left - tooltipRect.width / 2 + buttonRect.width / 2;
    const preferredTop = buttonRect.top - tooltipRect.height - 10; // Espacio entre el botón y el tooltip

    // Ajustar la posición si se sale de la pantalla hacia la izquierda
    let left = Math.max(preferredLeft, 0);

    // Ajustar la posición si se sale de la pantalla hacia arriba
    let top = Math.max(preferredTop, 0);

    // Ajustar la posición si el tooltip se sale de la pantalla hacia la derecha
    if (left + tooltipRect.width > windowWidth) {
      left = windowWidth - tooltipRect.width;
    }

    // Ajustar la posición si el tooltip se sale de la pantalla hacia abajo
    if (top + tooltipRect.height > windowHeight) {
      top = windowHeight - tooltipRect.height;
    }

    // Aplicar posición al tooltip
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
  }
}
