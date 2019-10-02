const React = require('react')
const Helmet = require('react-helmet').default
const Component = require('./component')

class Application extends React.Component {
  render () {
    return (
      <div>
        <Helmet>
          <meta charSet='utf-8' />
          <title>Application with favicon and background</title>
          <link
            rel='shortcut icon'
            href={require('./assets/favicon.ico')}
            type='image/x-icon'
          />
        </Helmet>
        <div style={{ margin: '200px auto', textAlign: 'center' }}>
          <img src={require('./assets/file.png')} />
          <Component />
        </div>
      </div>
    )
  }
}

module.exports = Application
