export = function mod(number: number, modulo: number): number {
	var remain = number % modulo;
	return Math.floor(remain >= 0 ? remain : remain + modulo);
};
