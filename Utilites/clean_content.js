const cleanTweetContent = (content) => {
    if (!content) return null;
    return content
      .split('\n')
      .filter(line => line.trim() && !line.includes('Follow') && !line.includes('Views'))
      .join(' ')
      .trim();
};

module.exports = {
    cleanTweetContent
}