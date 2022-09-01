const GlobalReg = require( "../src/es6globalreg.js" );

test("ensure share works", async () => {

	class MyClass{}

	const a = await GlobalReg.get( "foo", () => new MyClass());
	const b = await GlobalReg.get( "foo", () => new MyClass());

	expect( a === b ).toBe( true );
});

test("ensure release works", async () => {


	class MyClass{}

	const a = await GlobalReg.get( "bar", () => new MyClass());
	const b = await GlobalReg.get( "bar", () => new MyClass());

	expect( a === b ).toBe( true );

	expect( GlobalReg.instances( b )).toBe( 2 );

	// release only one copy
	await GlobalReg.release( a );

	expect( GlobalReg.instances( b )).toBe( 1 );

	// new get()'s share the global version
	const c = await GlobalReg.get( "bar", () => new MyClass());
	expect( a === c ).toBe( true );

	expect( GlobalReg.instances( b )).toBe( 2 );

	// release all copies
	await GlobalReg.releaseAll( b );

	expect( GlobalReg.instances( b )).toBe( 0 );

	let bThrows = false;
	try{
		await GlobalReg.release( c );
	}
	catch( err ){
		bThrows = true;
	}
	expect( bThrows ).toBe( true );

	// new get()'s don't share any more
	const d = await GlobalReg.get( "bar", () => new MyClass());

	expect( a === d ).toBe( false );
	expect( GlobalReg.instances( d )).toBe( 1 );
	expect( GlobalReg.instances( a )).toBe( 0 );
	expect( GlobalReg.instances( b )).toBe( 0 );
	expect( GlobalReg.instances( c )).toBe( 0 );
	
});
