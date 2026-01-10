function fixReviewAnswer(review) {
  if (review.answer && typeof review.answer === 'string') {
    return review.answer.replace(/\r?\n/g, '\\n').replace(/\\\\n/g, '\\n');
  }
  return review.answer;
}