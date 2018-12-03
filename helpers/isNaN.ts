export = Number.isNaN || function isNaN(a: number): boolean {
	return a !== a;
};
