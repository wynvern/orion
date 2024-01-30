const timeDifference = (timestamp: string) => {
    const currentDate = new Date();
    const postDate = new Date(timestamp);
    const timeDiffInSeconds = Math.floor(
        (currentDate.getTime() - postDate.getTime()) / 1000
    );

    const days = Math.floor(timeDiffInSeconds / 86400);

    if (days === 0) {
        return 'Hoje';
    } else if (days === 1) {
        return 'Ontem';
    } else if (days <= 7) {
        return 'Na última semana';
    } else if (days <= 30) {
        return 'No último mês';
    } else if (days <= 365) {
        return 'No último ano';
    } else {
        return 'Há muito tempo';
    }
};

export default timeDifference;
