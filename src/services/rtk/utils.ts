/**
 * Tags used by the cacher helpers
 */
export const tags = {
	LIST: 'LIST',
};

/**
 * Cache tags types
 */
export type CacheTagsType = typeof tags;

/**
 * An individual cache item
 */
export type CacheItem<T, Id> = { type: T; id: Id };

/**
 * A list of cache items, including a LIST entity cache
 */
export type CacheList<T, Id> = (CacheItem<T, 'LIST'> | CacheItem<T, Id>)[];

/**
 * Inner function returned by `providesList` to be passed to the `provides` property of a query
 */
type InnerProvidesList<T> = <Results extends { id: unknown }[]>(
	results: Results | undefined,
) => CacheList<T, Results[number]['id']>;

/**
 * HOF to create an entity cache to provide a LIST,
 * depending on the results being in a common format.
 *
 * Will not provide individual items without a result.
 *
 * @example
 * ```ts
 * const results = [
 *   { id: 1, message: 'foo' },
 *   { id: 2, message: 'bar' }
 * ]
 * providesList('Todo')(results)
 * // [
 * //   { type: 'Todo', id: 'List'},
 * //   { type: 'Todo', id: 1 },
 * //   { type: 'Todo', id: 2 },
 * // ]
 * ```
 */
export const providesList =
	<T extends string>(type: T): InnerProvidesList<T> =>
	results => {
		// is result available?
		if (results) {
			// successful query
			return [{ type, id: 'LIST' }, ...results.map(({ id }) => ({ type, id } as const))];
		}
		// Received an error, include an error cache item to the cache list
		return [];
	};

/**
 * HOF to create an entity cache to invalidate a LIST.
 *
 * Invalidates regardless of result.
 *
 * @example
 * ```ts
 * invalidatesList('Todo')()
 * // [{ type: 'Todo', id: 'List' }]
 * ```
 */
export const invalidatesList =
	<T extends string>(type: T) =>
	(): readonly [CacheItem<T, 'LIST'>] =>
		[{ type, id: 'LIST' }] as const;

/**
 * HOF to create an entity cache for a single item using the query argument as the Id.
 *
 * @example
 * ```ts
 * cacheByIdArg('Todo')({ id: 5, message: 'walk the fish' }, undefined, 5)
 * // returns:
 * // [{ type: 'Todo', id: 5 }]
 * ```
 */
export const cacheByIdArg =
	<T extends string>(type: T) =>
	<Id, Result = undefined, Error = undefined>(
		result: Result,
		error: Error,
		id: Id,
	): readonly [CacheItem<T, Id>] =>
		[{ type, id }] as const;

/**
 * HOF to create an entity cache for a single item using the id property from the query argument as the Id.
 *
 * @example
 * ```ts
 * cacheByIdArgProperty('Todo')(undefined, { id: 5, message: 'sweep up' })
 * // returns:
 * // [{ type: 'Todo', id: 5 }]
 * ```
 */
export const cacheByIdArgProperty =
	<T extends string>(type: T) =>
	<Arg extends { id: unknown }, Result = undefined, Error = undefined>(
		result: Result,
		error: Error,
		arg: Arg,
	): readonly [CacheItem<T, Arg['id']>] | [] =>
		[{ type, id: arg.id }] as const;

export const cacher = {
	tags,
	providesList,
	invalidatesList,
	cacheByIdArg,
	cacheByIdArgProperty,
};
