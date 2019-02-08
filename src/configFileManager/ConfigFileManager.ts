import { app } from 'electron';
import * as _ from 'lodash';
import * as path from 'path';

export class ConfigFileManager {

  private _fileName: string;
  private _filePath: string;

  constructor(
    fileName: string = 'config',
    filePath: string = app.getPath('userData')
  ){
    this.fileName = fileName;
    this.filePath = filePath;
  }

  get fileName() {
    return this._fileName;
  }

  /**
   * The parameter fileName cannot be empty, or cannot have only an extension (or a filename 
   * started by a dot).
   * 
   * The fileName will be encoded as a URI, to avoid problems with the file system.
   * 
   * The config file, when created, will have the .json extension. If the fileName is provided with
   * a .json extension, the file will not be created as .json.json. But if another extension is 
   * provided, like .txt, the file will be created as .txt.json.
   */
  set fileName(fileName: string) {
    if (_.isEmpty(fileName)) {
      throw new Error('The fileName cannot be empty.');
    }

    // Trick to prevent adding the `.json` twice
    // if the filename already contains it.
    const fileWithNoExt = path.basename(fileName, '.json');

    // If after removing the extension the filename is empty.
    if (_.isEmpty(fileWithNoExt)) {
      throw new Error('The fileName was not corrected formed.');
    }

    // Prevent ENOENT and other similar errors when using
    // reserved characters in Windows filenames.
    // See: https://en.wikipedia.org/wiki/Filename#Reserved%5Fcharacters%5Fand%5Fwords
    this._fileName = encodeURIComponent(`${fileWithNoExt}.json`)
      .replace(/\*/g, '-').replace(/%20/g, ' ');
  }

  get filePath() {
    return this._filePath;
  }

  /**
   * The filePath cannot be empty nor a relative path.
   */
  set filePath(filePath: string) {
    if (_.isEmpty(filePath)) {
      throw new Error('The filePath cannot be empty.');
    }

    if (!path.isAbsolute(filePath)) {
      throw new Error('The filePath should be an absolute directory');
    }

    this._filePath = path.normalize(filePath);
  }
}
