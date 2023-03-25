Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var useSWR = require('swr');
var _internal = require('swr/_internal');
var index_js = require('use-sync-external-store/shim/index.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var useSWR__default = /*#__PURE__*/_interopDefaultLegacy(useSWR);

// We have to several type castings here because `useSWRInfinite` is a special
const INFINITE_PREFIX = '$inf$';
const EMPTY_PROMISE = Promise.resolve();
const getFirstPageKey = (getKey)=>{
    return _internal.serialize(getKey ? getKey(0, null) : null)[0];
};
const unstable_serialize = (getKey)=>{
    return INFINITE_PREFIX + getFirstPageKey(getKey);
};
const infinite = (useSWRNext)=>{
    return (getKey, fn, config)=>{
        const didMountRef = react.useRef(false);
        const dataRef = react.useRef();
        const { cache , initialSize =1 , revalidateAll =false , persistSize =false , revalidateFirstPage =true , revalidateOnMount =false  } = config;
        // The serialized key of the first page. This key will be used to store
        // metadata of this SWR infinite hook.
        let infiniteKey;
        try {
            infiniteKey = getFirstPageKey(getKey);
            if (infiniteKey) infiniteKey = INFINITE_PREFIX + infiniteKey;
        } catch (err) {
        // Not ready yet.
        }
        const [get, set, subscribeCache] = _internal.createCacheHelper(cache, infiniteKey);
        const getSnapshot = react.useCallback(()=>{
            const size = _internal.isUndefined(get()._l) ? initialSize : get()._l;
            return size;
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            cache,
            infiniteKey,
            initialSize
        ]);
        index_js.useSyncExternalStore(react.useCallback((callback)=>{
            if (infiniteKey) return subscribeCache(infiniteKey, ()=>{
                callback();
            });
            return ()=>{};
        }, // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            cache,
            infiniteKey
        ]), getSnapshot, getSnapshot);
        const resolvePageSize = react.useCallback(()=>{
            const cachedPageSize = get()._l;
            return _internal.isUndefined(cachedPageSize) ? initialSize : cachedPageSize;
        // `cache` isn't allowed to change during the lifecycle
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            infiniteKey,
            initialSize
        ]);
        // keep the last page size to restore it with the persistSize option
        const lastPageSizeRef = react.useRef(resolvePageSize());
        // When the page key changes, we reset the page size if it's not persisted
        _internal.useIsomorphicLayoutEffect(()=>{
            if (!didMountRef.current) {
                didMountRef.current = true;
                return;
            }
            if (infiniteKey) {
                // If the key has been changed, we keep the current page size if persistSize is enabled
                // Otherwise, we reset the page size to cached pageSize
                set({
                    _l: persistSize ? lastPageSizeRef.current : resolvePageSize()
                });
            }
        // `initialSize` isn't allowed to change during the lifecycle
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [
            infiniteKey,
            cache
        ]);
        // Needs to check didMountRef during mounting, not in the fetcher
        const shouldRevalidateOnMount = revalidateOnMount && !didMountRef.current;
        // Actual SWR hook to load all pages in one fetcher.
        const swr = useSWRNext(infiniteKey, async ()=>{
            // get the revalidate context
            const [forceRevalidateAll, originalData] = get()._i || [];
            // return an array of page data
            const data = [];
            const pageSize = resolvePageSize();
            let previousPageData = null;
            for(let i = 0; i < pageSize; ++i){
                const [pageKey, pageArg] = _internal.serialize(getKey(i, previousPageData));
                if (!pageKey) {
                    break;
                }
                const [getSWRCache, setSWRCache] = _internal.createCacheHelper(cache, pageKey);
                // Get the cached page data.
                let pageData = getSWRCache().data;
                // should fetch (or revalidate) if:
                // - `revalidateAll` is enabled
                // - `mutate()` called
                // - the cache is missing
                // - it's the first page and it's not the initial render
                // - `revalidateOnMount` is enabled and it's on mount
                // - cache for that page has changed
                const shouldFetchPage = revalidateAll || forceRevalidateAll || _internal.isUndefined(pageData) || revalidateFirstPage && !i && !_internal.isUndefined(dataRef.current) || shouldRevalidateOnMount || originalData && !_internal.isUndefined(originalData[i]) && !config.compare(originalData[i], pageData);
                if (fn && shouldFetchPage) {
                    pageData = await fn(pageArg);
                    setSWRCache({
                        data: pageData,
                        _k: pageArg
                    });
                }
                data.push(pageData);
                previousPageData = pageData;
            }
            // once we executed the data fetching based on the context, clear the context
            set({
                _i: _internal.UNDEFINED
            });
            // return the data
            return data;
        }, config);
        // update dataRef
        _internal.useIsomorphicLayoutEffect(()=>{
            dataRef.current = swr.data;
        }, [
            swr.data
        ]);
        const mutate = react.useCallback(// eslint-disable-next-line func-names
        function(data, opts) {
            // When passing as a boolean, it's explicitly used to disable/enable
            // revalidation.
            const options = typeof opts === 'boolean' ? {
                revalidate: opts
            } : opts || {};
            // Default to true.
            const shouldRevalidate = options.revalidate !== false;
            // It is possible that the key is still falsy.
            if (!infiniteKey) return EMPTY_PROMISE;
            if (shouldRevalidate) {
                if (!_internal.isUndefined(data)) {
                    // We only revalidate the pages that are changed
                    const originalData = dataRef.current;
                    set({
                        _i: [
                            false,
                            originalData
                        ]
                    });
                } else {
                    // Calling `mutate()`, we revalidate all pages
                    set({
                        _i: [
                            true
                        ]
                    });
                }
            }
            return arguments.length ? swr.mutate(data, {
                ...options,
                revalidate: shouldRevalidate
            }) : swr.mutate();
        }, // swr.mutate is always the same reference
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            infiniteKey,
            cache
        ]);
        // Function to load pages data from the cache based on the page size.
        const resolvePagesFromCache = (pageSize)=>{
            // return an array of page data
            const data = [];
            let previousPageData = null;
            for(let i = 0; i < pageSize; ++i){
                var _cache_get;
                const [pageKey] = _internal.serialize(getKey(i, previousPageData));
                // Get the cached page data.
                const pageData = pageKey ? (_cache_get = cache.get(pageKey)) == null ? void 0 : _cache_get.data : _internal.UNDEFINED;
                // Return the current data if we can't get it from the cache.
                if (_internal.isUndefined(pageData)) return dataRef.current;
                data.push(pageData);
                previousPageData = pageData;
            }
            // Return the data
            return data;
        };
        // Extend the SWR API
        const setSize = react.useCallback((arg)=>{
            // It is possible that the key is still falsy.
            if (!infiniteKey) return EMPTY_PROMISE;
            let size;
            if (_internal.isFunction(arg)) {
                size = arg(resolvePageSize());
            } else if (typeof arg == 'number') {
                size = arg;
            }
            if (typeof size != 'number') return EMPTY_PROMISE;
            set({
                _l: size
            });
            lastPageSizeRef.current = size;
            return mutate(resolvePagesFromCache(size));
        }, // `cache` and `rerender` isn't allowed to change during the lifecycle
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [
            infiniteKey,
            resolvePageSize,
            mutate,
            cache
        ]);
        // Use getter functions to avoid unnecessary re-renders caused by triggering
        // all the getters of the returned swr object.
        return {
            size: resolvePageSize(),
            setSize,
            mutate,
            get data () {
                return swr.data;
            },
            get error () {
                return swr.error;
            },
            get isValidating () {
                return swr.isValidating;
            },
            get isLoading () {
                return swr.isLoading;
            }
        };
    };
};
var index = _internal.withMiddleware(useSWR__default["default"], infinite);

exports["default"] = index;
exports.infinite = infinite;
exports.unstable_serialize = unstable_serialize;
