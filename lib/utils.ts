export function formatToKRW(price: number) {
    return price.toLocaleString("ko-KR");
}

export function formatToTimeAgo(date: string): string {
    const dayInMs = 86400000;
    const hourInMs = 3600000;
    const minuteInMs = 60000;
    const time = new Date(date).getTime();
    const now = new Date().getTime();
    const diffMs = time - now;

    const formatter = new Intl.RelativeTimeFormat("ko");

    if (Math.abs(diffMs) < minuteInMs) {
        // 1분 미만일 경우
        const diffSeconds = Math.round(diffMs / 1000);
        return formatter.format(diffSeconds, "seconds");
    } else if (Math.abs(diffMs) < hourInMs) {
        // 1시간 미만일 경우
        const diffMinutes = Math.round(diffMs / minuteInMs);
        return formatter.format(diffMinutes, "minutes");
    } else if (Math.abs(diffMs) < dayInMs) {
        // 24시간 미만일 경우
        const diffHours = Math.round(diffMs / hourInMs);
        return formatter.format(diffHours, "hours");
    } else {
        // 그 외의 경우
        const diffDays = Math.round(diffMs / dayInMs);
        return formatter.format(diffDays, "days");
    }
}
