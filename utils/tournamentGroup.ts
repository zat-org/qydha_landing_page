

export const getGroupTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
        'A': 'المجموعة أ',
        'B': 'المجموعة ب',
        'C': 'المجموعة ج',
        'D': 'المجموعة د',
        'Final': 'النهائي',
        'Semi-Final': 'نصف النهائي',
        'Quarter-Final': 'ربع النهائي'
    };
    return typeLabels[type] || type;
};

export const getMatchStateLabel = (state: string): string => {
    const stateLabels: Record<string, string> = {
        'Ended': 'منتهي',
        'Running': 'جاري',
        'Created': 'منشأ',
        'matches_generated': 'تم إنشاء المباريات',
        'matches_running': 'تم تشغيل المباريات',
        'matches_finished': 'تم إنهاء المباريات'
    };
    return stateLabels[state] || state;
};

export const getTeamCountColor = (count: number): "error" | "success" | "primary" | "secondary" | "info" | "warning" | "neutral" => {
    if (count >= 16) return 'success';
    if (count >= 8) return 'primary';
    if (count >= 4) return 'warning';
    return 'error';
};

