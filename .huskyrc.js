module.exports = {
  hooks: {
    'prepare-commit-msg': 'git-commit-template',
    'pre-commit':
      'npm --no-git-tag-version version patch && git add package.json && git add package-lock.json && lint-staged'
  }
};
