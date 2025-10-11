class Alert {
  constructor() {
    this.alerts = [];
  }

  async loadAlerts() {
    try {
  // Use a relative path so alerts load correctly when published from /docs
  const response = await fetch('./json/alerts.json');
      const alertsData = await response.json();
      return alertsData;
    } catch (error) {
      console.error('Error loading alerts:', error);
      return [];
    }
  }

  async displayAlerts() {
    const alertsData = await this.loadAlerts();
    
    if (alertsData.length === 0) {
      return;
    }

    const alertSection = this.createAlertSection(alertsData);
    this.prependToMain(alertSection);
  }

  createAlertSection(alertsData) {
    const section = document.createElement('section');
    section.className = 'alert-list';

    alertsData.forEach(alertData => {
      const alertParagraph = this.createAlertParagraph(alertData);
      section.appendChild(alertParagraph);
    });

    return section;
  }

  createAlertParagraph(alertData) {
    const p = document.createElement('p');
    p.textContent = alertData.message;
    p.style.backgroundColor = alertData.background;
    p.style.color = alertData.color;
    p.className = 'alert-item';
    
    return p;
  }

  prependToMain(alertSection) {
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.prepend(alertSection);
    }
  }
}

export default Alert;