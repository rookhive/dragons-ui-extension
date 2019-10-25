export const platform = (
    typeof browser !== 'undefined'
        ? browser
        : chrome
)

export const promisify = (context, func, ...args) => {
    if (typeof func === 'string') {
        func = context[func]
    }
    return new Promise(resolve => {
        func.apply(context, args.concat([data => resolve(data)]))
    })
}