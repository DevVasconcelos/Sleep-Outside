import Alert from './Alert.js';

document.addEventListener('DOMContentLoaded', async () => {
  const alert = new Alert();
  await alert.displayAlerts();
});

export { Alert };