const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

export default function formatTimestamp(timestamp: any) {
    const date = new Date(timestamp);

    const dia = date.getUTCDate();
    const mes = monthNames[date.getUTCMonth()];
    const ano = date.getFullYear();

    return `${dia} de ${mes} de ${ano}`;
}
