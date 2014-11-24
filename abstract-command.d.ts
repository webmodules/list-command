/// <reference path="types.d.ts" />
/**
 * TypeScript dependencies.
 */
import Command = require('command');
/**
 * Abstract `Command` base class to make implementing custom commands easier.
 *
 * @class
 * @public
 */
declare class AbstractCommand implements Command {
    document: Document;
    constructor(doc?: Document);
    execute(range?: Range, value?: any): void;
    queryEnabled(range?: Range): boolean;
    queryState(range?: Range): boolean;
    protected _execute(range: Range, value?: any): void;
    protected _queryEnabled(range: Range): void;
    protected _queryState(range: Range): void;
}
export = AbstractCommand;
