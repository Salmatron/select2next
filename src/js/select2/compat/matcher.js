
export function oldMatcher(matcher) {
    function wrappedMatcher(params, data) {
        const match = $.extend(true, {}, data);

        if (params.term == null || $.trim(params.term) === '') {
            return match;
        }

        if (data.children) {
            for (let c = data.children.length - 1; c >= 0; c--) {
                const child = data.children[c];

                // Check if the child object matches
                // The old matcher returned a boolean true or false
                const doesMatch = matcher(params.term, child.text, child);

                // If the child didn't match, pop it off
                if (!doesMatch) {
                    match.children.splice(c, 1);
                }
            }

            if (match.children.length > 0) {
                return match;
            }
        }

        if (matcher(params.term, data.text, data)) {
            return match;
        }

        return null;
    }

    return wrappedMatcher;
}
