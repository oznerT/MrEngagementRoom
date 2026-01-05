
export default class SessionTracker {
    static KEYS = {
        TIME_TOTAL: 'mreng_time_ms_total',
        MONITOR_ENTERS: 'mreng_monitor_enters',
        EXIT_METHOD: 'mreng_exit_method',
        CLICKS: 'mreng_click_count',
        SESSION_START: 'mreng_session_started_at',
        LAST_EXIT: 'mreng_last_exit_at'
    };

    static init() {
        if (!localStorage.getItem(this.KEYS.SESSION_START)) {
            localStorage.setItem(this.KEYS.SESSION_START, Date.now().toString());
        }
        if (!localStorage.getItem(this.KEYS.TIME_TOTAL)) {
            localStorage.setItem(this.KEYS.TIME_TOTAL, '0');
        }
        if (!localStorage.getItem(this.KEYS.MONITOR_ENTERS)) {
            localStorage.setItem(this.KEYS.MONITOR_ENTERS, '0');
        }
        if (!localStorage.getItem(this.KEYS.EXIT_METHOD)) {
            localStorage.setItem(this.KEYS.EXIT_METHOD, 'unknown');
        }
        if (!localStorage.getItem(this.KEYS.CLICKS)) {
            localStorage.setItem(this.KEYS.CLICKS, '0');
        }
    }

    static updateTime(deltaMs: number) {
        const current = parseInt(localStorage.getItem(this.KEYS.TIME_TOTAL) || '0');
        localStorage.setItem(this.KEYS.TIME_TOTAL, (current + deltaMs).toString());
    }

    static incrementEnters() {
        const current = parseInt(localStorage.getItem(this.KEYS.MONITOR_ENTERS) || '0');
        localStorage.setItem(this.KEYS.MONITOR_ENTERS, (current + 1).toString());
    }

    static incrementClicks() {
        const current = parseInt(localStorage.getItem(this.KEYS.CLICKS) || '0');
        localStorage.setItem(this.KEYS.CLICKS, (current + 1).toString());
    }

    static setExitMethod(method: 'button' | 'esc' | 'unknown') {
        localStorage.setItem(this.KEYS.EXIT_METHOD, method);
        localStorage.setItem(this.KEYS.LAST_EXIT, Date.now().toString());
    }
}
