const timeDifference = (timestamp: string) => {
    const currentDate = new Date();
    const postDate = new Date(timestamp);

    // Set both dates to the start of the day to compare just the dates
    currentDate.setHours(0, 0, 0, 0);
    postDate.setHours(0, 0, 0, 0);

    const timeDiffInMilliseconds = currentDate.getTime() - postDate.getTime();
    const timeDiffInDays = Math.floor(
        timeDiffInMilliseconds / (1000 * 60 * 60 * 24)
    );

    if (timeDiffInDays === 0) {
        return 'Hoje';
    } else if (timeDiffInDays === 1) {
        return 'Ontem';
    } else if (timeDiffInDays <= 7) {
        return 'Na última semana';
    } else if (timeDiffInDays <= 30) {
        return 'No último mês';
    } else if (timeDiffInDays <= 365) {
        return 'No último ano';
    } else {
        return 'Há muito tempo';
    }
};

export default timeDifference;
