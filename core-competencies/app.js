// todo
// - detect input param and just show that result
// - ability to show child TrainingResources
// - make true react view that doesn't reload page
var dataSource = '../datasets/ebi-cp-knowledge-base.json'; // eventually we may have a separate list of only competencies...
loadData(dataSource);

function appProcessData(data) {

  // just show each competency once
  for (var i = 0; i < data.length; i++) {
    // see if any future rows have same competencyMapping
    for (var i2 = i+1; i2 < data.length; i2++) {
      if (data[i] != undefined && data[i2] != undefined) {
        if (data[i].competencyMapping.trim() == data[i2].competencyMapping.trim()) {
          // remove duplicate entry
          data[i2] = undefined;
        }
      }
    }
  }

  // we have object keys that are undefine, prune them
  let prunedData = [Object.keys(data).forEach((key) =>
    (data[key] == null) && delete data[key]), data][1];

    console.table(prunedData);
  return prunedData;
}

// Bootstrap the app
function appTask(data) {
  $('#interactive').html('Rendering....')
  ReactDOM.render(
    <CompetencyTable TrainingResources={data} />,
    document.getElementById('interactive')
  );
}

class TrainingResourceCategoryRow extends React.Component {
  render() {
    return (<tr><th colSpan="4">{this.props.category}</th></tr>);
  }
}

class TrainingResourceRow extends React.Component {
  render() {
    var name = this.props.TrainingResource.expired ?
      this.props.TrainingResource.name :
      <div>
        <span style={{color: 'grey'}}>
          <h4>Sample competency name</h4>
          <p>Description here&nbsp;
          <a name={this.props.TrainingResource.competencyMapping} href="#" className="readmore">View related training resources (to come)</a>
          </p>
        </span>
      </div>
      ;

      if (this.props.TrainingResource.typeOnlineOrFacetoface == 'online') {
        var attendanceInfo = <div><a className="small readmore" href={this.props.TrainingResource.url} target="_blank">Take now</a></div>;
      } else {
        var attendanceInfo = <div><a className="small readmore" href={this.props.TrainingResource.url} target="_blank">View event location and date</a></div>;
      }

    return (
      <tr>
        <td>{this.props.TrainingResource.competencyMapping}</td>
        <td colSpan='2'>{name}</td>
      </tr>
    );
  }
}

class TrainingResourceTable extends React.Component {
  render() {
    var rows = [];
    var lastCompetency = null;
    // console.log(this.props.faceToFaceTraining)
    // console.log(this.props.onlineTraining)
    console.log('val',this.props.filterText,$('#searchfilter').val());
    this.props.TrainingResources.forEach((TrainingResource) => {
      if (TrainingResource.name.indexOf(this.props.filterText) === -1) {
        return;
      }
      if (!TrainingResource.expired && this.props.enabledOnly) {
        return;
      }
      if ((TrainingResource.typeOnlineOrFacetoface == 'online') && (this.props.onlineTraining === false)) {
        // console.log('fail',TrainingResource.typeOnlineOrFacetoface,this.props.onlineTraining);
        return;
      }
      if ((TrainingResource.typeOnlineOrFacetoface == 'face-to-face') && (this.props.faceToFaceTraining === false)) {
        // console.log('fail',TrainingResource.typeOnlineOrFacetoface,this.props.onlineTraining);
        return;
      }
      // if (TrainingResource.competencyMapping !== lastCompetency) {
      //   rows.push(<TrainingResourceCategoryRow category={TrainingResource.competencyMapping} key={TrainingResource.competencyMapping} />);
      // }
      var uniqueKey = TrainingResource.competencyMapping + "_" + TrainingResource.name + "_";
      // var uniqueKey = TrainingResource.competencyMapping + "_" + TrainingResource.name + "_" + Math.floor(Math.random()*1000);
      rows.push(<TrainingResourceRow TrainingResource={TrainingResource} key={uniqueKey} />);
      lastCompetency = TrainingResource.competencyMapping;
    });
    if (rows.length === 0) {
      rows.push(<tr><td>Nothing found, sorry.</td></tr>);
    }

    return (
      <div>
        <table className='tablesorter'>
          <thead>
            <tr>
              <th>Competency</th>
              <th colSpan='2'>Name and description</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }
}

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextInputChange = this.handleFilterTextInputChange.bind(this);
    this.handleOnlineTrainingInputChange = this.handleOnlineTrainingInputChange.bind(this);
    this.handleFaceToFaceTrainingInputChange = this.handleFaceToFaceTrainingInputChange.bind(this);
    this.handleInStockInputChange = this.handleInStockInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFilterTextInputChange(e) {
    console.log('handleFilterTextInputChange',e.target);
    this.props.onFilterTextInput(e.target.value);
  }

  handleOnlineTrainingInputChange(e) {
    this.props.onOnlineTrainingInput(e.target.checked);
  }

  handleFaceToFaceTrainingInputChange(e) {
    this.props.onFaceToFaceTrainingInput(e.target.checked);
  }

  handleInStockInputChange(e) {
    this.props.onInStockInput(e.target.checked);
  }

  handleSubmit(e) {
    console.log('submit',$('#searchfilter').val());
    e.preventDefault();
    var filterVal = '';
    if ($('#searchfilter').val() != undefined) {
      filterVal = $('#searchfilter').val().join(' ');
    }
    this.props.onFilterTextInput(filterVal);
  }

  // To do: concat the logic of the change events:
  // https://github.com/react-toolbox/react-toolbox/issues/652

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className="hidden"
          id="inputfilter"
          type="text"
          placeholder="Filter training resources - not user acceisble"
          value={this.props.filterText}
          onChange={this.handleFilterTextInputChange}/>
        <select
          type="text"
          id="searchfilter"
          placeholder="Filter training resources">
        </select>
        <p>
          <input
            type="checkbox"
            checked={this.props.onlineTraining}
            onChange={this.handleOnlineTrainingInputChange}
          />
          {' '}
          Show online courses
          {' | '}
          <input
            type="checkbox"
            checked={this.props.faceToFaceTraining}
            onChange={this.handleFaceToFaceTrainingInputChange}
          />
          {' '}
          Show face-to-face
          {' | '}
          <input
            type="checkbox"
            checked={this.props.enabledOnly}
            onChange={this.handleInStockInputChange}
          />
          {'  '}
          Show only active training resources
          {'  '}
          <input
            className="button filtersubmit"
            type="submit"
            value="Filter these"
            onChange={this.handleInStockInputChange}
          />
          {'  '}
        </p>
      </form>
    );
  }
}

class CompetencyTable extends React.Component {
  componentDidMount() {
    $.tablesorter.addParser({
      id: 'decimal',
      is: function(s) {
        // return false so this parser is not auto detected
        return false;
      },
      format: function(s) {
        // format your data for normalization
        var lNumber = Math.floor(s); // the large part
        var sNumber = s.split('.')[1]; // the small part
        var calcNumber = ((lNumber * 100) + Math.floor(sNumber));
        return calcNumber;
      },
      // set type, either numeric or text
      type: 'numeric'
     });
    $('.tablesorter').tablesorter({
      // sortInitialOrder: "asc",
      sortList: [[0,0],[1,0]],
      headers: {
        0: { sorter: "decimal", empty : "top", sortInitialOrder: "asc" }
      }
    });
    $().liveFilter('#searchfilter');

    // $('#searchfilter').trigger('update');
    // connect select2 to reactjs via submit button
    // the submit button will then map our jquery value to react components
    $('#searchfilter').on('change', function(){
      // console.log('user added new query');
      $('#searchfilter').parent().find($('.button')).click();
    });
  }
  componentDidUpdate() {
    // update the parent form by "submitting"

    $('.tablesorter').trigger('update');
    // http://tablesorter.com/docs/example-ajax.html
  }

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      faceToFaceTraining: true,
      onlineTraining: true,
      enabledOnly: false
    };

    this.handleFilterTextInput = this.handleFilterTextInput.bind(this);
    this.handleFaceToFaceTrainingInput = this.handleFaceToFaceTrainingInput.bind(this);
    this.handleOnlineTrainingInput = this.handleOnlineTrainingInput.bind(this);
    this.handleInStockInput = this.handleInStockInput.bind(this);
  }

  handleFilterTextInput(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  handleFaceToFaceTrainingInput(faceToFaceTraining) {
    this.setState({
      faceToFaceTraining: faceToFaceTraining
    })
  }

  handleOnlineTrainingInput(onlineTraining) {
    this.setState({
      onlineTraining: onlineTraining
    })
  }

  handleInStockInput(enabledOnly) {
    this.setState({
      enabledOnly: enabledOnly
    })
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          onFaceToFaceTrainingInput={this.handleFaceToFaceTrainingInput}
          faceToFaceTraining={this.state.faceToFaceTraining}
          onOnlineTrainingInput={this.handleOnlineTrainingInput}
          onlineTraining={this.state.onlineTraining}
          enabledOnly={this.state.enabledOnly}
          onFilterTextInput={this.handleFilterTextInput}
          onInStockInput={this.handleInStockInput}
        />
        <TrainingResourceTable
          TrainingResources={this.props.TrainingResources}
          filterText={this.state.filterText}
          faceToFaceTraining={this.state.faceToFaceTraining}
          onlineTraining={this.state.onlineTraining}
          enabledOnly={this.state.enabledOnly}
        />
      </div>
    );
  }
}