import { onMounted, onUnmounted } from "vue"

interface IOptions {
  once: boolean;
}

export const useKeyboard = (keys: string[] | string, fn: EventListener, options?: IOptions) => {
  if (!fn || !keys) return;

  keys = typeof keys === 'string' ? [keys] : keys

  let isActive = false;

  const { once } = options || {};

  const toggleActive = () => {
    isActive = !isActive;
  }

  const keydownEventFn = (e: KeyboardEvent) => {

    if (!keys.includes(e.key)) return;

    if (isActive) return;

    if (e.key === ' ') {
      e.preventDefault();
    }
    
    if (once) {
      toggleActive();
    }

    fn(e);
  };

  const keyupEventFn = () => toggleActive();

  onMounted(() => {
    document.addEventListener('keydown', keydownEventFn);
    if (once) {
      document.addEventListener('keyup', keyupEventFn);
    }
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', keydownEventFn);
    if (once) {
      document.addEventListener('keyup', keyupEventFn);
    }
  });
}