// English
export const Translated = {
    errorLoading () {
        return 'The results could not be loaded.';
    },
    inputTooLong (args) {
        const overChars = args.input.length - args.maximum;

        let message = `Please delete ${overChars} character`;

        if (overChars != 1) {
            message += 's';
        }

        return message;
    },
    inputTooShort (args) {
        const remainingChars = args.minimum - args.input.length;

        const message = `Please enter ${remainingChars} or more characters`;

        return message;
    },
    loadingMore () {
        return 'Loading more results…';
    },
    maximumSelected (args) {
        let message = `You can only select ${args.maximum} item`;

        if (args.maximum != 1) {
            message += 's';
        }

        return message;
    },
    noResults () {
        return 'No results found';
    },
    searching () {
        return 'Searching…';
    },
    removeAllItems () {
        return 'Remove all items';
    }
};

