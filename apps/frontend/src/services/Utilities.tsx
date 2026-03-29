const UtilitiesService = {
  // https://stackoverflow.com/a/3177838
  timeSince: (date: Date): string => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
      return Math.floor(interval) + ' years ago';
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + ' months ago';
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + ' days ago';
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + ' hours ago';
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + ' minutes ago';
    }
    return Math.floor(seconds) + ' seconds ago';
  },

  // https://stackoverflow.com/a/60988355
  formatNumber: (num: number): string => {
    const formatter = Intl.NumberFormat('en', { notation: 'compact' });
    return formatter.format(num).toLowerCase();
  },

  saveUserInfo: (username: string) => {
    localStorage.setItem('userInfo', JSON.stringify({ username }));
  },

  getUserInfo: (): { username: string } | undefined => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) return undefined;
    return JSON.parse(userInfo);
  },

  clearUserInfo: () => {
    localStorage.removeItem('userInfo');
  },

  isLoggedIn: (): boolean => {
    const info = UtilitiesService.getUserInfo();

    if (!info) return false;

    return Boolean(info.username);
  },
};

export default UtilitiesService;
