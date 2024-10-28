//Services/DifficultyService.js

/**
 * Calculates the recommended difficulty level based on enhanced performance metrics.
 * @param {Object} metrics - The performance metrics.
 * @param {number} metrics.accuracyRate - The student's accuracy rate as a percentage.
 * @param {number} metrics.averageAnswerTime - The average answer time in seconds.
 * @param {number} metrics.attemptsPerQuestion - Average number of attempts per question.
 * @param {number} metrics.consistency - Performance consistency rating (improving, stable, declining).
 * @param {number} metrics.completionRate - Percentage of rounds completed fully.
 * @returns {string} - The recommended difficulty level ('easy', 'medium', 'hard').
 */

function calculateDifficultyLevel(metrics) {
    const {accuracyRate, averageAnswerTime, attemptsPerQuestion, consistency, completionRate} = metrics;

    const weights = {
        accuracyRate: 0.4,
        averageAnswerTime: 0.3,
        attemptsPerQuestion: 0.15,
        consistency: 0.05,
        completionRate: 0.05
    };

    const normalizedMetrics = {
        accuracyRate: accuracyRate / 100,
        averageAnswerTime: Math.max(1 - averageAnswerTime / 20, 0),
        attemptsPerQuestion: Math.max(1 - attemptsPerQuestion / 5, 0),
        consistency: consistency === 'improving' ? 1 : consistency === 'stable' ? 0.5 : 0,
        completionRate: completionRate / 100,
    };


    // overall performance score calculated by weighted sum of normalized metrics
    // This is not an array, it's an object.
    const perfromanceScore =
        (normalizedMetrics.accuracyRate * weights.accuracyRate) +
        (normalizedMetrics.averageAnswerTime * weights.averageAnswerTime) +
        (normalizedMetrics.attemptsPerQuestion * weights.attemptsPerQuestion) +
        (normalizedMetrics.consistency * weights.consistency) +
        (normalizedMetrics.completionRate * weights.completionRate);

    
    let recommendedDifficulty;
    if (perfromanceScore >= 0.85) {
        recommendedDifficulty = 'easy';
    } else if (perfromanceScore >= 0.6) {
        recommendedDifficulty = 'medium';
    } else {
        recommendedDifficulty = 'hard';
    }

    return recommendedDifficulty;
}

module.exports = { calculateDifficultyLevel };