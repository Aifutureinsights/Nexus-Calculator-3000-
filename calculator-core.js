class NexusCalculator {
    constructor() {
        this.steps = [];
    }

    calculate(expression) {
        try {
            this.steps = [];
            const result = this.evaluateStepByStep(expression);
            this.steps.push(`Final Result: ${result}`);
            return { result, steps: this.steps };
        } catch (error) {
            this.steps.push('SYNTAX ERROR');
            throw new Error('Calculation error');
        }
    }

    evaluateStepByStep(expression) {
        const parsed = math.parse(expression);
        const simplified = parsed.compile();

        const traverse = (node) => {
            if (node.isOperatorNode) {
                const left = traverse(node.args[0]);
                const right = traverse(node.args[1]);
                const operation = `${left} ${node.op} ${right}`;
                const result = math.evaluate(operation);
                this.steps.push(`${operation} = ${result}`);
                return result;
            } else if (node.isConstantNode || node.isSymbolNode) {
                return node.value || node.name;
            }
            return node.toString();
        };

        return traverse(parsed);
    }
}